using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Microsoft.AspNetCore.Mvc;
using UserSignup.Data;
using UserSignup.Models;

namespace UserSignup.Controllers
{
    public class HomeController : Controller
    {
        private IAmazonDynamoDB dynamoDBClient;
        public HomeController(IAmazonDynamoDB dynamoDBClient)
        {
            //_context = context;
            this.dynamoDBClient = dynamoDBClient;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind("Username, Password")] User user)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User newUser = await service.InsertUser(user);
            return RedirectToAction("Confirm");
        }

        public ViewResult Confirm()
        {
            return View();
        }


        [HttpGet("api/{username}")]
        public async Task<ActionResult> GetUser(string username)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User user = await service.GetUserAsync(username);
            return Ok(user);
        }

        [HttpGet("api/{username}/card")]
        public async Task<ActionResult> GetCards(string username)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User user = await service.GetUserAsync(username);
            var cardList = new List<Card>();
            foreach (string id in user.Cards)
            {
                cardList.Add(await service.getCard(id));
            }

            return Ok(cardList.Where(card => card != null));
        }

        [HttpGet("api/card/{id}")]
        public async Task<ActionResult> GetCard(string id)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card card = await service.getCard(id);
            return Ok(card);
        }

        [HttpPut("api/card/edit")]
        public async Task<ActionResult> EditCard([FromBody] Card card)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card newCard = await service.UpdateCard(card);
            return Ok(newCard);
        }

        [HttpPost("api/{username}/card")]
        public async Task<ActionResult> InsertCard(string username, [FromBody] Card card)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card newCard = await service.InsertCard(card);
            User user = await service.GetUserAsync(username);
            List<string> newList = user.Cards;
            newList.Add(newCard.Id);
            user.Cards = newList;
            await service.InsertUser(user);
            return Ok(newCard);
        }


        [HttpDelete("api/card/delete/{id}")]
        public void DeleteCard(string id)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            service.DeleteCard(id);
        }

    }
}
