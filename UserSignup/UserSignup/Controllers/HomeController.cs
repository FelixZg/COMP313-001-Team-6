﻿using System;
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
        public async Task<ActionResult> getUser(string username)
        {
            DynamoDBServices service = new DynamoDBServices(dynamoDBClient);
            User user = await service.GetUserAsync(username);
            UserDTO userDTO = new UserDTO();
            userDTO.Username = user.Username;
            userDTO.Password = user.Password;
            foreach (string id in user.Cards)
            {
                userDTO.Cards.Add(await service.getCard(id));
            }
            return Ok(userDTO);
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

      
    }
}
