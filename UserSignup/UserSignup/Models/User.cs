using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserSignup.Models
{
    [DynamoDBTable("User")]
    public class User
    {
        [DynamoDBHashKey]
        public string Username { get; set; }
        public string Password { get; set; }
        public List<string> Cards { get; set; }
    }
}
