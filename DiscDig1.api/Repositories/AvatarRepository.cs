using Dapper;
using DiscDig1.DataModels;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class AvatarRepository : IAvatarRepository
    {
        string _connectionString;

        public AvatarRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public IEnumerable<Avatar> GetAllAvatars()
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var avatars = db.Query<Avatar>("SELECT * FROM [Avatar]");
                return avatars;
            }
        }
    }
}
