using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserSignup.Models
{
    [DynamoDBTable("Card")]
    public class Card
    {
        [DynamoDBHashKey]
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Tag { get; set; }
        public string Priority { get; set; }
        public string Date { get; set; }

    }
}
