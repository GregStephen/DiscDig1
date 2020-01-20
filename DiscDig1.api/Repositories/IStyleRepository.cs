using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface IStyleRepository
    {
        bool AddStyleToAlbum(Guid albumId, string styleName);
        List<string> GetListOfStyleNamesForAlbum(Guid albumId);
    }
}
