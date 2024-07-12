using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SimpleBase;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;
using ToDoApp.Service.Interfaces;

namespace ToDoApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly IUserManager _userManager;
    public AuthenticationController(IConfiguration configuration, IUserManager userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
    }
    private async Task<UserDTO?> AuthenticateUser(UserAddDTO user)
    {
        UserDTO? _user = null;
        UserDTO? existingUser = await _userManager.GetUserByUserName(user.UserName);
        if (existingUser != null)
        {
            if (BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                _user = new UserDTO { UserName = existingUser.UserName, Id = existingUser.Id};
            }
        }
        return _user;
    }
    private async Task<string> GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
        }
        return Base32.Rfc4648.Encode(randomNumber);
    }

    private async Task<string> GenerateToken(UserDTO user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"],
        new List<Claim> { new Claim("name", user.UserName), new Claim("userId",user.Id.ToString())},
        expires: DateTime.Now.AddMinutes(1),
        signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(UserDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> GetUserByUserName(string userName)
    {
        try
        {
            UserDTO? existingUser = await _userManager.GetUserByUserName(userName);
            if (existingUser == null)
            {
                return NotFound("user Not Found");
            }
            else
            {
                return Ok(existingUser);
            }
        }
        catch
        {
            return StatusCode(500, "Error in finding user");
        }
    }

    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [HttpGet("Refresh")]
    public async Task<IActionResult> Refresh(string refreshToken)
    {
        try
        {
            UserDTO? user = await _userManager.GetUserByRefreshToken(refreshToken);
            if (user == null)
            {
                return Unauthorized("Invalid refresh token");
            }

            string newAccessToken = await GenerateToken(user);
            string newRefreshToken = await GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateUser(user);

            return Ok(new { accessToken = newAccessToken, refreshToken = newRefreshToken });
        }
        catch
        {
            return StatusCode(500, "Error in refreshing token");
        }
    }


    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(UserAddDTO user)
    {
        try
        {
            var existingUser = await _userManager.GetUserByUserName(user.UserName);
            if (existingUser == null)
            {
                return Unauthorized(new { message = "UserName does not exist" });
            }

            var authenticatedUser = await AuthenticateUser(user);
            if (authenticatedUser == null)
            {
                return Unauthorized(new { message = "Password not matched" });
            }
            var accessToken = await GenerateToken(authenticatedUser);
            var refreshToken = await GenerateRefreshToken();
            UserDTO? userDTO = await _userManager.GetUserByUserName(user.UserName);
            userDTO!.RefreshToken = refreshToken;
            await _userManager.UpdateUser(userDTO);
            return Ok(new { accessToken = accessToken, refreshToken = refreshToken });
        }
        catch
        {
            return StatusCode(500, "Error in generating token");
        }
    }
    [AllowAnonymous]
    [ProducesResponseType(201, Type = typeof(UserDTO))]
    [ProducesResponseType(500)]
    [ProducesResponseType(400)]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(UserAddDTO user)
    {
        try
        {
            if (await _userManager.GetUserByUserName(user.UserName) != null)
            {
                return BadRequest("User already exists.");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            UserDTO userAdded = await _userManager.AddUser(user);
            return CreatedAtAction(nameof(GetUserByUserName), userAdded);
        }
        catch
        {
            return StatusCode(500, "Error in registering the user");
        }
    }
}
