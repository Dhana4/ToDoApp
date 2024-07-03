using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Data.Data;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;
    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<User?> GetUserByUserName(string userName)
    {
        return await _dbContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);
    }
    public async Task<User> AddUser(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }
    public async Task<User?> GetUserByRefreshToken(string refreshToken)
    {
        User? user = await _dbContext.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null) return null;
        return user;
    }

    public async Task UpdateUser(User user)
    {
        User? existingUser = await _dbContext.Users.SingleOrDefaultAsync(u => u.UserName == user.UserName);
        if (existingUser != null)
        {
            existingUser.RefreshToken = user.RefreshToken;
            _dbContext.Users.Update(existingUser);
            await _dbContext.SaveChangesAsync();
        }
    }
}
