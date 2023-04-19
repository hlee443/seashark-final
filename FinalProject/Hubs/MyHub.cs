using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using FinalProject.Models;

namespace FinalProject.Hubs
{
    public class MyHub : Hub
    {
        public async Task BroadcastAuthorChange(string changeType, Author author)
        {
            await Clients.All.SendAsync("AuthorChanged", changeType, author);
        }

        public async Task BroadcastBookChange(string changeType, Book book)
        {
            await Clients.All.SendAsync("BookChanged", changeType, book);
        }
    }
}
