using DiscDig1.DataModels;
using DiscDig1.DTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface IUserRepository
    {
        User GetUserByFirebaseId(string firebaseId);
        User GetUserById(Guid userId);
        bool EditUser(EditUserDTO editedUser);
        bool DeleteUser(Guid userId);
        bool AddNewUserToDatabase(NewUserDTO newUser);
        DashboardData GetUsersDashboardData(Guid userId);
    }
}
