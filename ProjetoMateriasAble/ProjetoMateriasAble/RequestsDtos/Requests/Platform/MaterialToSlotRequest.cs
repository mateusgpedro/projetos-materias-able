using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record AddMaterialToSlotRequest(int SlotId, int? MaterialId, int Amount);

public record RemoveMaterialToSlotRequest(int SlotId, int Amount);