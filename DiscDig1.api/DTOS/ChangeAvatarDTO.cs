using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class ChangeAvatarDTO
    {
        public Guid UserId { get; set; }
        public Guid AvatarId { get; set; }
    }
}
