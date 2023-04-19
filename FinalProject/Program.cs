using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using FinalProject.Hubs;
using FinalProject.Data;
using System.Text.Json.Serialization;
// ...

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the database to use PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql("Host=containers-us-west-14.railway.app;Port=6078;Database=railway;Username=postgres;Password=8QwXOg2ArDrkS95bJBJw"));

// Add SignalR services
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
// app.UseHttpsRedirection();
// Map SignalR hub
app.MapHub<MyHub>("/myHub");
app.UseAuthorization();
app.MapControllers();

app.Run();
