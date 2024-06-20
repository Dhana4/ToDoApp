using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.DTOs;

namespace ToDoApp.Service.Interfaces;
public interface IUserManager
{
    Task<UserDTO?> GetUserByUserName(string userName);
    Task<UserDTO> AddUser(UserAddDTO userAddDTO);
}
