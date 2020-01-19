using Dapper;
using DiscDig1.DataModels;
using DiscDig1.DTOS;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class CollectionRepository : ICollectionRepository
    {
        string _connectionString;
        private IAlbumRepository _albumRepo;
        private IGenreRepository _genreRepo;
        private IStyleRepository _styleRepo;

        public CollectionRepository(IConfiguration configuration, IAlbumRepository albumRepo, IGenreRepository genreRepo, IStyleRepository styleRepo)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
            _albumRepo = albumRepo;
            _genreRepo = genreRepo;
            _styleRepo = styleRepo;
        }

        public AlbumCollection GetUsersMainCollection(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var collection = new AlbumCollection();
                var mainId = GetUsersMainCollectionId(userId);
                collection.Id = mainId;
                collection.Name = "Main";
                var sql = @"SELECT a.*
                            FROM CollectionAlbum ca
                            JOIN Album a
                            ON ca.AlbumId = a.Id
                            WHERE ca.CollectionId = @mainId";

                var parameters = new { mainId };
                var albums = db.Query<Album>(sql, parameters).ToList();
                
                foreach (Album album in albums)
                {
                    album.Genre = _genreRepo.GetListOfGenreNamesForAlbum(album.Id);
                    album.Style = _styleRepo.GetListOfStyleNamesForAlbum(album.Id);
                }
                collection.Albums = albums;
                collection.NumberInCollection = albums.Count;
                return collection;
            }
        }
        public bool addMainCollectionForNewUser(Guid newUserId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Collection]
                            (
                               [UserId],
                               [Name]
                            )
                            VALUES
                            (
                                @newUserId,
                                'Main'
                            )";
                var parameters = new { newUserId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

        public Guid GetUsersMainCollectionId(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT Id
                            FROM [Collection]
                            WHERE [Name] = 'Main'";
                var parameters = new { userId };
                return db.QueryFirst<Guid>(sql, parameters);
            }
        }
        public bool AddNewAlbumToMainCollection(AlbumToCollectionDTO albumToCollectionDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var album = albumToCollectionDTO.NewAlbum;
                Guid albumId;
                var albumCheck = _albumRepo.GetAlbumIdByDiscogId(album.DiscogId);
                if (albumCheck == default)
                {
                    albumId = _albumRepo.AddNewAlbumToDatabase(album);
                }
                else
                {
                    albumId = albumCheck;
                }
                var mainId = GetUsersMainCollectionId(albumToCollectionDTO.UserId);
                var sql = @"INSERT INTO [CollectionAlbum]
                        (
                            [CollectionId],
                            [AlbumId]
                        )
                            VALUES
                        (
                            @mainId,
                            @albumId
                        )";
                var parameters = new { albumId, mainId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

        public bool CheckToSeeIfAlbumExistsInUsersMainCollectionAlready(Guid userId, int albumDiscogId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var mainId = GetUsersMainCollectionId(userId);
                var albumId = _albumRepo.GetAlbumIdByDiscogId(albumDiscogId);
                var sql = @"SELECT Id
                            FROM [CollectionAlbum]
                            WHERE [AlbumId] = @albumId AND [CollectionId] = @mainId";
                var parameters = new { mainId, albumId };
                var id = db.QueryFirstOrDefault<Guid>(sql, parameters);
                if (id == default)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }
    }
}
