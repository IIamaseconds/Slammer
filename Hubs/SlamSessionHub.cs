using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Slammer.Hubs
{
    public class SlamSessionHub : Hub
    {
        public async Task Slam(string user)
        {
            await Clients.All.SendAsync("Slammed", new Random(DateTime.Now.Millisecond).Next(1,100), user);
        }
    }
}