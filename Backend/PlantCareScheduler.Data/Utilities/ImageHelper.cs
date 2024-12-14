using System;
namespace PlantCareScheduler.Data.Utilities
{
    public static class ImageHelper
    {
        public static string ConvertImageToBase64(string imagePath)
        {
            if (!File.Exists(imagePath))
                return null;

            byte[] imageBytes = File.ReadAllBytes(imagePath);
            return $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}";
        }
    }
}

