FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ProjetoMateriasAble.csproj", "ProjetoMateriasAble/"]
RUN dotnet restore "ProjetoMateriasAble/ProjetoMateriasAble.csproj"
COPY . ./

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM build as dbupdate
WORKDIR /src/ProjetoMateriasAble
RUN dotnet tool install --global dotnet-ef
RUN dotnet ef database update 

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjetoMateriasAble.dll"]
