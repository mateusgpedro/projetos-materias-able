namespace ProjetoMateriasAble.Models.Platform;

public class Notification
{
    public int Id { get; set; }
    public string NotificationMessage { get; set; }
    public NotificationType NotificationType { get; set; }
}

public enum NotificationType
{
    MaterialCreation = 0,
}