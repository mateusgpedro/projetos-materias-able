using System.Globalization;
using System.Text;

namespace ProjetoMateriasAble.Utils;

public class Diacritics
{
    public static string RemoveDiacritics(string text)
    {
        string normalized = text.Normalize(NormalizationForm.FormD);
        return new string(normalized.Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray());
    }
}