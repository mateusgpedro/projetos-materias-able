using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.Authentication;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Infra;

public class ApplicationDbContext : IdentityDbContext<AppUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Material>(m =>
        {
            m.Property(m => m.Id)
                .ValueGeneratedOnAdd();
        });

        builder.Entity<WarehouseSlot>(ws =>
        {
            ws.HasKey(ws => ws.WarehouseSlotId);
            ws.Property(ws => ws.WarehouseSlotId).ValueGeneratedOnAdd();

            ws.HasOne(ws => ws.Material)
                .WithMany(m => m.WarehouseSlots)
                .HasForeignKey(ws => ws.MaterialId);
        });

        builder.Entity<Sku>(s =>
        {
            s.HasKey(s => s.Id);

            s.Property(s => s.Id)
                .ValueGeneratedOnAdd();

            s.HasOne(s => s.Recipe)
                .WithOne(r => r.Sku)
                .HasForeignKey<Sku>(s => s.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Warehouse>(w =>
        {
            w.HasKey(w => w.Id);
        
            w.Property(w => w.Id)
                .ValueGeneratedOnAdd();
        
            w.HasMany(w => w.WarehouseSlots)
                .WithOne(ws => ws.Warehouse)
                .HasForeignKey(w => w.WarehouseId);
        });

        builder.Entity<Recipe>(r =>
        {
            r.HasKey(r => r.Id);
            
            r.Property(r => r.Id)
                .ValueGeneratedOnAdd();
        });

        builder.Entity<ProductionPlan>(pp =>
        {
            pp.HasKey(pp => pp.Id);
            
            pp.Property(pp => pp.Id)
                .ValueGeneratedOnAdd();

            pp.HasMany(pp => pp.ProductionOrders)
                .WithOne(po => po.ProductionPlan)
                .HasForeignKey(pp => pp.PlanId);
        });

        builder.Entity<ProductionOrder>(po =>
        {
            po.HasKey(po => po.Id);

            po.Property(po => po.Id)
                .ValueGeneratedOnAdd();
        });

        builder.Entity<RefreshToken>(rt =>
        {
            rt.HasKey(rt => rt.Id);
        });

        builder.Entity<LinhaDeEnchimento>(le =>
        {
            le.HasKey(le => le.Id);
        });

        builder.Entity<SkuLinhaEnchimento>(sle =>
        {
            sle.HasKey(sle => new { sle.SkuId, sle.LinhaDeEnchimentoId});

            sle.Property(sle => sle.LinhaDeEnchimentoId).ValueGeneratedOnAdd();
            
            sle.HasOne(sle => sle.Sku)
                .WithMany(s => s.SkusLinhasDeEnchimento)
                .HasForeignKey(sle => sle.SkuId);

            sle.HasOne(sle => sle.LinhaDeEnchimento)
                .WithMany(le => le.SkusLinhasDeEnchimento)
                .HasForeignKey(sle => sle.LinhaDeEnchimentoId);
        });

        builder.Entity<Manufacturer>(m =>
        {
            m.HasKey(m => m.Id );

            m.Property(m => m.Id).ValueGeneratedOnAdd();
        });

        builder.Entity<ManufacturerCodeRelation>(mcr =>
        { 
            mcr.HasKey(mcr => mcr.Id);

            mcr.HasOne(mcr => mcr.Material)
                .WithMany(m => m.ManufacturerCodeRelations)
                .HasForeignKey(m => m.MaterialId);

            mcr.HasOne(mcr => mcr.Manufacturer)
                .WithMany(m => m.ManufacturerCodeRelations)
                .HasForeignKey(m => m.ManufacturerId);
        });

        builder.Entity<RecipeMaterialsAmount>(rma =>
        {
            rma.HasKey(rma => rma.Id);

            rma.HasOne(rma => rma.Material)
                .WithMany(m => m.RecipeMaterialsAmounts)
                .HasForeignKey(rma => rma.MaterialId);

            rma.HasOne(rma => rma.Recipe)
                .WithMany(r => r.RecipeMaterialsAmounts)
                .HasForeignKey(rma => rma.RecipeId);
        });

        builder.Entity<Notification>(n =>
        {
            n.HasKey(n => n.Id);
        });

        builder.Entity<UserNotification>(un =>
        {
            un.HasKey(un => new { un.NotificationId, un.UserId });

            un.HasOne(un => un.Notification)
                .WithMany(n => n.Receivers)
                .HasForeignKey(un => un.NotificationId);
            
            un.HasOne(un => un.AppUser)
                .WithMany(n => n.Notifications)
                .HasForeignKey(un => un.UserId);
        });
        
        base.OnModelCreating(builder);
    } 

    public DbSet<UserNotification> UserNotificationsJoinTable { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<RecipeMaterialsAmount> RecipeMaterialsAmounts { get; set; }
    public DbSet<ManufacturerCodeRelation> ManufacturerCodeRelations { get; set; }
    public DbSet<Manufacturer> Manufacturers { get; set; }
    public DbSet<SkuLinhaEnchimento> SkusLinhasDeEnchimento { get; set; }
    public DbSet<LinhaDeEnchimento> LinhasDeEnchimento { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<WarehouseSlot> WarehouseSlots { get; set; }
    public DbSet<Sku> Skus { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<ProductionPlan> ProductionPlans { get; set; }
    public DbSet<ProductionOrder> ProductionOrders { get; set; }
}