using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public class MaterialApproval
{
    public int Id { get; set; }
    public string CreatedByID { get; set; }
    public AppUser CreatedBy { get; set; }
    public int MaterialId { get; set; }
    public Material Material { get; set; }
    public ApprovalStatus EStatus { get; set; }
    public string? RejectionReason { get; set; }
    // public List<Notification> Notifications { get; set; }
}

public enum ApprovalStatus
{
    Pending = 0,
    Rejected = 1,
    Approved = 2
}
