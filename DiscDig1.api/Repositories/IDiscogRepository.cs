using DiscDig1.DataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface IDiscogRepository
    {
        DiscogResponse GetAlbumsFromDiscog(string query);
    }
}
