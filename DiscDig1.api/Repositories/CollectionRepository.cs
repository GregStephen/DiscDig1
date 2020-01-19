using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class CollectionRepository : ICollectionRepository
    {
        string _connectionString;

        public CollectionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public bool addMainCollectionForNewUser(Guid newUserId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Collection]
                            (
                               [UserId],
                               [Name]
                            )
                            VALUES
                            (
                                @newUserId,
                                'Main'
                            )";
                var parameters = new { newUserId };
                return (db.Execute(sql, parameters) == 1);
            }
        }
    }
}
