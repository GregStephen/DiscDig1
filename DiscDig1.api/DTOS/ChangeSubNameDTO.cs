using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class ChangeSubNameDTO
    {
        public Guid CollectionId { get; set; }
        public string NewSubCollectionName { get; set; }
    }
}
