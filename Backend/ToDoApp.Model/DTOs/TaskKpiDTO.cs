using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Model.DTOs;
public class TaskKpiDTO
{
    public int CompletedPercentage { get; set; }
    public int ActivePercentage { get; set; }
}
