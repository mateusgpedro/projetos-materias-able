﻿FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ProjetoMateriasAble.csproj", "ProjetoMateriasAble/"]
RUN dotnet restore "ProjetoMateriasAble/ProjetoMateriasAble.csproj"
COPY . ./

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjetoMateriasAble.dll"]
