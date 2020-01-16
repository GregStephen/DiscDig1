using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class NewUserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid AvatarId { get; set; }
        public string FirebaseUid { get; set; }
        public DateTime DateCreated { get; set; }

    }
}
