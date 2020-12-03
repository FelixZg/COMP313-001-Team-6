using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserSignup.Models;

namespace UserSignup.Data
{
    public class DynamoDBServices
    {
        IAmazonDynamoDB dynamoDBClient { get; set; }

        public DynamoDBServices(IAmazonDynamoDB dynamoDBClient)
        {
            this.dynamoDBClient = dynamoDBClient;
        }

        public async Task<User> InsertUser(User user)
        {
            DynamoDBContext context = new DynamoDBContext(dynamoDBClient);
            // Add a unique id for the primary key.
            //user.Id = System.Guid.NewGuid().ToString();
            await context.SaveAsync(user, default(System.Threading.CancellationToken));
            User newUser = await context.LoadAsync<User>(user.Username, default(System.Threading.CancellationToken));
            return user;
        }

        public async Task<User> GetUserAsync(string username)
        {
            DynamoDBContext context = new DynamoDBContext(dynamoDBClient);
            User newUser = await context.LoadAsync<User>(username, default(System.Threading.CancellationToken));
            return newUser;
        }
    }
}
