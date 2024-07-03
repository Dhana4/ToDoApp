using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;

namespace ToDoApp.Service.Mapping;
public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<ToDoItem, TaskDTO>();
        CreateMap<TaskAddDTO, ToDoItem>();
        CreateMap<UserAddDTO, User>();
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();
        CreateMap<TaskDTO, ToDoItem>();
    }
}
