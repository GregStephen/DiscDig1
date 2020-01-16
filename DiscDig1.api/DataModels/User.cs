using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class User
    {
        public Guid Id { get; set; }
        public Guid FirebaseUid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid AvatarId { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
