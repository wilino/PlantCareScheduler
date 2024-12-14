
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
            var basePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DefaultImages");

            modelBuilder.Entity<PlantType>().HasData(
                new PlantType
                {
                    Id = Guid.NewGuid(),
                    Name = "Succulent",
                    Description = "Low water requirement, ideal for dry climates.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "succulent.png"))
                },
                new PlantType
                {
                    Id = Guid.NewGuid(),
                    Name = "Tropical",
                    Description = "High water requirement, prefers humid environments.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "tropical.png"))
                },
                new PlantType
                {
                    Id = Guid.NewGuid(),
                    Name = "Herb",
                    Description = "Common for culinary uses, moderate water requirement.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "herb.png"))
                },
                new PlantType
                {
                    Id = Guid.NewGuid(),
                    Name = "Cacti",
                    Description = "Extremely low water requirement, thrives in arid conditions.",
                    DefaultImageBase64 = ImageHelper.ConvertImageToBase64(Path.Combine(basePath, "cacti.png"))
                }
            );

            modelBuilder.Entity<Location>().HasData(
                new Location { Id = Guid.NewGuid(), Name = "Living Room" },
                new Location { Id = Guid.NewGuid(), Name = "Garden" },
                new Location { Id = Guid.NewGuid(), Name = "Kitchen" }
            );
        }
    }
}

