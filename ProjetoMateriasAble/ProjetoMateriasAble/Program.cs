using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Services;
using ProjetoMateriasAble.Services.Materials;
using ProjetoMateriasAble.Services.Production;
using ProjetoMateriasAble.Services.Recipes;
using ProjetoMateriasAble.Services.Sku;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddNpgsql<ApplicationDbContext>(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyz1234567890._-";

    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;

    options.SignIn.RequireConfirmedEmail = false;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddErrorDescriber<IdentityErrorDescriber>()
    .AddTokenProvider("Custom", typeof(DataProtectorTokenProvider<AppUser>));

builder.Services.Configure<DataProtectionTokenProviderOptions>(op =>
{
    op.TokenLifespan = TimeSpan.FromDays(0.001);
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        RequireExpirationTime = false,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtBearerTokenSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtBearerTokenSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtBearerTokenSettings:SecretKey"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<ISkuService, SkuService>();
builder.Services.AddScoped<IProductionService, ProductionService>();
builder.Services.AddScoped<IRecipeService, RecipeService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();