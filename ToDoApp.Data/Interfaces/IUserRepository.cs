using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Interfaces;
public interface IUserRepository
{
    Task<User?> GetUserByUserName(string userName);
    Task<User> AddUser(User user);
}
