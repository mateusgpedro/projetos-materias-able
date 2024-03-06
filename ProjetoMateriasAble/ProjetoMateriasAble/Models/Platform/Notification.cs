using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.JoinTables;

namespace ProjetoMateriasAble.Models.Platform;

public class Notification
{
    public int Id { get; set; }
    public string NotificationTitle { get; set; }
    public string NotificationMessage { get; set; }
    public string Url { get; set; }
    public string SenderUsername { get; set; }
    public DateTime SendTime { get; set; }
    
    public ICollection<UserNotification>? Receivers { get; set; }
}