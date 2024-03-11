using Microsoft.AspNetCore.Identity;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;

namespace ProjetoMateriasAble.Infra.User;

public class AppUser : IdentityUser
{
    public required string FullName { get; set; }
    public ICollection<MaterialApproval> MaterialApprovals { get; set; }
    public ICollection<UserNotification> Notifications { get; set; }
}