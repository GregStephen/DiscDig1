--CREATE DATABASE [DiscDig]

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'User')
	BEGIN
	CREATE TABLE [User]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[FirstName] NVARCHAR(255) not null,
		[LastName] NVARCHAR(255) not null,
		[DateCreated] DateTime not null,
		[FirebaseUid] NVARCHAR (255) not null,
		[AvatarId] UNIQUEIDENTIFIER not null
	)
	END
ELSE
	PRINT 'User table already exists'
	

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'Album')
	BEGIN
	CREATE TABLE [Album]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[Title] NVARCHAR(200) not null,
		[ImgUrl] NVARCHAR(max) not null,
		[Label] NVARCHAR(20) not null,
		[Artist] NVARCHAR(200) not null,
		[ReleaseYear] DateTime not null
	)
	END
ELSE
	PRINT 'Album table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'AlbumGenre')
	BEGIN
	CREATE TABLE [AlbumGenre]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[AlbumId] UNIQUEIDENTIFIER not null,
		[GenreId] UNIQUEIDENTIFIER not null
	)
	END
ELSE
	PRINT 'AlbumGenre table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'Genre')
	BEGIN
	CREATE TABLE [Genre]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[Name] NVARCHAR(25) not null,
	)
	END
ELSE
	PRINT 'Genre table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'AlbumStyle')
	BEGIN
	CREATE TABLE [AlbumStyle]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[AlbumId] UNIQUEIDENTIFIER not null,
		[StyleId] UNIQUEIDENTIFIER not null
	)
	END
ELSE
	PRINT 'AlbumStyle table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'Style')
	BEGIN
	CREATE TABLE [Style]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[Name] NVARCHAR(25) not null
	)
	END
ELSE
	PRINT 'Style table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'Avatar')
	BEGIN
	CREATE TABLE [Avatar]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[ImgUrl] NVARCHAR(max) not null,
		[Name] NVARCHAR(50) not null
	)
	END
ELSE
	PRINT 'Avatar table already exists'

IF not exists (SELECT * FROM sys.tables WHERE [name] = 'Collection')
	BEGIN
	CREATE TABLE [Collection]
	(
		[Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		[UserId] UNIQUEIDENTIFIER not null,
		[AlbumId] UNIQUEIDENTIFIER not null,
		[Name] NVARCHAR(30) not null,
	)
	END
ELSE
	PRINT 'Collection table already exists'


IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_User_Avatar')
	BEGIN
	ALTER TABLE [User]
	ADD CONSTRAINT FK_User_Avatar
		FOREIGN KEY (AvatarId) 
		REFERENCES [Avatar] (Id)
	END
ELSE
	PRINT 'Foreign key FK_User_Avatar already exists'

IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_Collection_User')
	BEGIN
	ALTER TABLE [Collection]
	ADD CONSTRAINT FK_Collection_User
		FOREIGN KEY (UserId) 
		REFERENCES [User] (Id)
	END
ELSE
	PRINT 'Foreign key FK_Collection_User already exists'

IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_Collection_Album')
	BEGIN
	ALTER TABLE [Collection]
	ADD CONSTRAINT FK_Collection_Album
		FOREIGN KEY (AlbumId) 
		REFERENCES [Album] (Id)
	END
ELSE
	PRINT 'Foreign key FK_Collection_Album already exists'

IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_AlbumGenre_Album')
	BEGIN
	ALTER TABLE [AlbumGenre]
	ADD CONSTRAINT FK_AlbumGenre_Album
		FOREIGN KEY (AlbumId) 
		REFERENCES [Album] (Id)
	END
ELSE
	PRINT 'Foreign key FK_AlbumGenre_Album already exists'

IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_AlbumGenre_Genre')
	BEGIN
	ALTER TABLE [AlbumGenre]
	ADD CONSTRAINT FK_AlbumGenre_Genre
		FOREIGN KEY (GenreId) 
		REFERENCES [Genre] (Id)
	END
ELSE
	PRINT 'Foreign key FK_AlbumGenre_Genre already exists'

	IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_AlbumStyle_Style')
	BEGIN
	ALTER TABLE [AlbumStyle]
	ADD CONSTRAINT FK_AlbumStyle_Style
		FOREIGN KEY (StyleId) 
		REFERENCES [Style] (Id)
	END
ELSE
	PRINT 'Foreign key FK_AlbumStyle_Style already exists'

IF not exists (SELECT * FROM sys.foreign_keys WHERE [name] = 'FK_AlbumStyle_Album')
	BEGIN
	ALTER TABLE [AlbumStyle]
	ADD CONSTRAINT FK_AlbumStyle_Album
		FOREIGN KEY (AlbumId) 
		REFERENCES [Album] (Id)
	END
ELSE
	PRINT 'Foreign key FK_AlbumStyle_Album already exists'