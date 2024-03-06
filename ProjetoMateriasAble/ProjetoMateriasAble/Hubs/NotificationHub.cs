using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ProjetoMateriasAble.Hubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var nameId = Context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
        
        await Groups.AddToGroupAsync(Context.ConnectionId, nameId);

        await Clients.Group(nameId).SendAsync("ReceiveMessage", "Hello");
    }
}