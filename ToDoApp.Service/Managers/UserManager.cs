using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;
using ToDoApp.Service.Interfaces;

namespace ToDoApp.Service.Managers;
public   class UserManager : IUserManager
{
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;
    public UserManager(IMapper mapper, IUserRepository userRepository)
    {
        _mapper = mapper;
        _userRepository = userRepository;
    }
    public async Task<UserDTO> AddUser(UserAddDTO userAddDTO)
    {
        return  _mapper.Map<UserDTO>(await _userRepository.AddUser(_mapper.Map<User>(userAddDTO)));
    }
    public async Task<UserDTO?> GetUserByUserName(string userName)
    {
        User? user = await _userRepository.GetUserByUserName(userName);
        if(user == null)
        {
            return null;
        }
        else
        {
            return _mapper.Map<UserDTO>(user);
        }
    }
}
