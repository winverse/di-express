-- CreateType
CREATE TYPE notice_category_enum AS ENUM (
	'developer',
	'design',
  'marketing',
  'service',
	'planner'
);

-- CreateTable
CREATE TABLE public."Users" (
	id text NOT NULL,
	email varchar(50) NULL,
	username varchar(30) NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Users_pkey" PRIMARY KEY (id)
);

-- CreateTable
CREATE TABLE public."Companies" (
	id text NOT NULL,
	"name" varchar(20) NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Companies_pkey" PRIMARY KEY (id),
	CONSTRAINT "Companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE public."Notices" (
	id text NOT NULL,
	title varchar(100) NOT NULL,
	category notice_category_enum NOT NULL DEFAULT 'developer'::"notice_category_enum",
	description text NOT NULL,
	"isPublished" bool NOT NULL DEFAULT false,
	"isDeleted" bool NOT NULL DEFAULT false,
	"companyId" text NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Notices_pkey" PRIMARY KEY (id),
	CONSTRAINT "Notices_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Companies"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE public."UserOnNotices" (
	id text NOT NULL,
	"userId" text NOT NULL,
	"noticeId" text NOT NULL,
	"registeredAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "UserOnNotices_pkey" PRIMARY KEY (id),
	CONSTRAINT "UserOnNotices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "UserOnNotices_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES public."Notices"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Companies_name_key" ON public."Companies"("name");