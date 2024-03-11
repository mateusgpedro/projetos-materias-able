namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record ApprovalRequest(int MaterialId, bool WasApproved, string? Reason);