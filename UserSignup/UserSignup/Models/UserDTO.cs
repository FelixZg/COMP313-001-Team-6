using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserSignup.Models
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public ICollection<Card> Cards { get; set; } = new List<Card>();
    }
}
