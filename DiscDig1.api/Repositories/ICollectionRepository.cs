using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface ICollectionRepository
    {
        bool addMainCollectionForNewUser(Guid newUserId);
    }
}
