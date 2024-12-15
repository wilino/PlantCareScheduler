using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Data.Utilities;

namespace PlantCareScheduler.Data
{
    public class PlantDbContext : DbContext
    {
        public DbSet<Plant> Plants { get; set; }
        public DbSet<PlantType> PlantTypes { get; set; }
        public DbSet<PlantCareHistory> PlantCareHistories { get; set; }
        public DbSet<Location> Locations { get; set; }

        public PlantDbContext(DbContextOptions<PlantDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies(); // Habilitar lazy loading
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Plant>()
                .HasOne(p => p.PlantType)
                .WithMany()
                .HasForeignKey(p => p.PlantTypeId);

            modelBuilder.Entity<PlantCareHistory>()
                .HasOne(h => h.Plant)
                .WithMany(p => p.CareHistory)
                .HasForeignKey(h => h.PlantId);

            base.OnModelCreating(modelBuilder);

            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var basePath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.FullName, "DefaultImages");


            // Plant Types
            var succulentTypeId = Guid.NewGuid();
            var tropicalTypeId = Guid.NewGuid();
            var herbTypeId = Guid.NewGuid();
            var cactiTypeId = Guid.NewGuid();

            modelBuilder.Entity<PlantType>().HasData(
                new PlantType
                {
                    Id = succulentTypeId,
                    Name = "Succulent",
                    Description = "Low water requirement, ideal for dry climates.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "succulent.png"))
                },
                new PlantType
                {
                    Id = tropicalTypeId,
                    Name = "Tropical",
                    Description = "High water requirement, prefers humid environments.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "tropical.png"))
                },
                new PlantType
                {
                    Id = herbTypeId,
                    Name = "Herb",
                    Description = "Common for culinary uses, moderate water requirement.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "herb.png"))
                },
                new PlantType
                {
                    Id = cactiTypeId,
                    Name = "Cacti",
                    Description = "Extremely low water requirement, thrives in arid conditions.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "cacti.png"))
                }
            );

            // Locations
            var livingRoomId = Guid.NewGuid();
            var gardenId = Guid.NewGuid();
            var kitchenId = Guid.NewGuid();

            modelBuilder.Entity<Location>().HasData(
                new Location { Id = livingRoomId, Name = "Living Room" },
                new Location { Id = gardenId, Name = "Garden" },
                new Location { Id = kitchenId, Name = "Kitchen" }
            );

            // Plants
            modelBuilder.Entity<Plant>().HasData(
                new Plant
                {
                    Id = Guid.NewGuid(),
                    Name = "Aloe Vera",
                    PlantTypeId = succulentTypeId,
                    LocationId = livingRoomId,
                    WateringFrequencyDays = 7,
                    LastWateredDate = DateTime.Now.AddDays(-5),
                    ImageBase64 = null
                },
                new Plant
                {
                    Id = Guid.NewGuid(),
                    Name = "Monstera",
                    PlantTypeId = tropicalTypeId,
                    LocationId = gardenId,
                    WateringFrequencyDays = 3,
                    LastWateredDate = DateTime.Now.AddDays(-2),
                    ImageBase64 = null
                },
                new Plant
                {
                    Id = Guid.NewGuid(),
                    Name = "Basil",
                    PlantTypeId = herbTypeId,
                    LocationId = kitchenId,
                    WateringFrequencyDays = 2,
                    LastWateredDate = DateTime.Now.AddDays(-1),
                    ImageBase64 = null
                },
                new Plant
                {
                    Id = Guid.NewGuid(),
                    Name = "Cactus",
                    PlantTypeId = cactiTypeId,
                    LocationId = livingRoomId,
                    WateringFrequencyDays = 14,
                    LastWateredDate = DateTime.Now.AddDays(-10),
                    ImageBase64 = null
                }
            );
        }
    }
}