using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Models.JoinTables;

public class UserNotification
{
    public string UserId { get; set; }
    public AppUser AppUser { get; set; }
    public int NotificationId { get; set; }
    public Notification Notification { get; set; }
}