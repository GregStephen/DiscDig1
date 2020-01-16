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
        bool AddNewUserToDatabase(NewUserDTO newUser);
    }
}
