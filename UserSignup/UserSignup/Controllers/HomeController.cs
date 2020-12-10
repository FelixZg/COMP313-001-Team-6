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
    [Route("api/")]
    [ApiController]
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

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
                User userExists = await service.GetUserAsync(user.Username);
                if (userExists == null)
                {
                    return NotFound("The user does not exist");
                }
                else
                {
                    if (BCrypt.Net.BCrypt.Verify(user.Password, userExists.Password))
                    {
                        return Ok("Logged in");
                    }
                    else
                    {
                        return BadRequest("The password entered was not correct");
                    }
                }
            } 
            else
            {
                return BadRequest(ModelState);
            }          
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] User user)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User userExists = await service.GetUserAsync(user.Username);
            if  (userExists != null)
            {
                return BadRequest("A user with this username already exists");
            } 
            else
            {
                await service.InsertUser(user);
                return Ok();
            } 
        }

        public ViewResult Confirm()
        {
            return View();
        }


        [HttpGet("{username}")]
        public async Task<ActionResult> GetUser(string username)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User user = await service.GetUserAsync(username);
            return Ok(user.Username);
        }

        [HttpGet("{username}/card")]
        public async Task<ActionResult> GetCards(string username)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User user = await service.GetUserAsync(username);
            var cardList = new List<Card>();
            if (user.Cards != null)
            {
                foreach (string id in user.Cards)
                {
                    cardList.Add(await service.getCard(id));
                }
                return Ok(cardList.Where(card => card != null));
            }
            else
            {
                return NotFound("This user does not have any cards");
            }   
        }

        [HttpGet("card/{id}")]
        public async Task<ActionResult> GetCard(string id)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card card = await service.getCard(id);
            return Ok(card);
        }

        [HttpPut("{username}/card/edit/{id}")]
        public async Task<ActionResult> EditCard([FromBody] Card card)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card newCard = await service.UpdateCard(card);
            return Ok(newCard);
        }

        [HttpPost("{username}/card")]
        public async Task<ActionResult> InsertCard(string username, [FromBody] Card card)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            Card newCard = await service.InsertCard(card);
            User user = await service.GetUserAsync(username);
            if (user.Cards != null)
            {
                List<string> cardList = user.Cards;
                cardList.Add(newCard.Id);
                user.Cards = cardList;
                await service.UpdateUser(user);
                return Ok(newCard);
            }
            else
            {
                List<string> newList = new List<string>();
                newList.Add(newCard.Id);
                user.Cards = newList;
                await service.UpdateUser(user);
                return Ok(newCard);
            }
        }


        [HttpDelete("{username}/card/delete/{id}")]
        public void DeleteCard(string id)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            service.DeleteCard(id);
        }
    }
}
