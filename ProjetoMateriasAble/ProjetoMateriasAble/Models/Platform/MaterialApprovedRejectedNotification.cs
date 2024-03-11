using ProjetoMateriasAble.RequestsDtos.Requests.Platform;

namespace ProjetoMateriasAble.Models.Platform;

public class MaterialApprovedRejectedNotification : Notification
{
    public int MaterialApprovalId { get; set; }
    public MaterialApproval MaterialApproval { get; set; }
}