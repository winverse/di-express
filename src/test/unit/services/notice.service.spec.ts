import { NoticeListQueryDto } from "@controllers/v1/notices/dto/";
import { NoticeService } from "@services/notice.service";
import cuid from "cuid";
import { format } from "date-fns";
import {
  ConfilctException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "src/common/exceptions";
import { Notice } from "src/common/interface";
import {
  ALREADY_DELETED_NOTICE,
  ALREADY_EXISTS_APPLICANTS,
  CANNOT_REGISTER_NOTICES,
  DUPLICATED_NOTICE_TITLE,
  EXISTS_ALREADY_TAKEN_NOTICE,
  NOT_FOUND_NOTICE,
  NOT_NOTICE_OWNER,
} from "src/constants";

import {
  mockNotice,
  mockNoticeBulkCreateInput,
  mockNoticeCreateInput,
  mockNoticeList,
  mockCompanyId,
  mockId,
  mockNoticeWithApplicants,
  mockUserOnNotices,
  mockNoticeListWithPage,
  mockNoticeRawSqlResult,
  mockNoticeDetailResult,
} from "src/test/mock";
import {
  StubNoticesRepository,
  StubUserOnNoticesRepository,
} from "src/test/stub/repository";

describe("NoticeService", () => {
  const noticesRepository = new StubNoticesRepository();
  const userOnNoticesRepository = new StubUserOnNoticesRepository();

  describe("NoticeService.create", () => {
    describe("[Success]", () => {
      it("채용 공고 생성 성공", async () => {
        noticesRepository.findByTitle.mockResolvedValue(undefined);
        noticesRepository.create.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.create(
          mockNoticeCreateInput,
          mockCompanyId,
        );
        expect(result).toEqual(mockNotice);
      });
    });
    describe("[Failure]", () => {
      it("중복된 공고명으로 생성 실패", async () => {
        noticesRepository.findByTitle.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(
          noticeService.create(mockNoticeCreateInput, mockCompanyId),
        ).rejects.toThrowError(new ConfilctException(DUPLICATED_NOTICE_TITLE));
      });
    });
  });
  describe("NoticeService.bulkCreate", () => {
    describe("[Success]", () => {
      it("채용 공고 대량 생성 성공", async () => {
        noticesRepository.findByTitle.mockResolvedValue(undefined);
        noticesRepository.bulkCreate.mockResolvedValue(mockNoticeList);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.bulkCreate(
          mockNoticeBulkCreateInput,
          mockCompanyId,
        );

        expect(result).toEqual(mockNoticeList);
      });
    });
    describe("[Failure]", () => {
      it("채용 공고 대량 생성시 중복되는 공고명 존재하는 경우", async () => {
        noticesRepository.findByTitle.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(
          noticeService.bulkCreate(mockNoticeBulkCreateInput, mockCompanyId),
        ).rejects.toThrowError(new ConfilctException(DUPLICATED_NOTICE_TITLE));
      });
    });
  });
  describe("NoticeService.update", () => {
    let newNotice: Notice;
    beforeEach(() => {
      newNotice = {
        ...mockNotice,
        ...mockNoticeCreateInput,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:MM:SS"),
      };
    });
    describe("[Success]", () => {
      it("채용 공고 수정 성공", async () => {
        noticesRepository.findById.mockResolvedValue(mockNotice);
        noticesRepository.update.mockResolvedValue(newNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );
        const result = await noticeService.update(
          mockNoticeCreateInput,
          mockNotice.id,
          mockNotice.companyId,
        );

        expect(result).toEqual(newNotice);
        expect(result.createdAt).not.toEqual(result.updatedAt);
      });
    });
    describe("[Failure]", () => {
      it("id로 찾을 수 없는 공고를 수정하려는 경우", async () => {
        noticesRepository.findById.mockResolvedValue(undefined);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(
          noticeService.update(
            mockNoticeCreateInput,
            mockNotice.id,
            mockNotice.companyId,
          ),
        ).rejects.toThrowError(new NotFoundException(NOT_FOUND_NOTICE));
      });
      it("삭제된 공고를 수정하려는 경우", async () => {
        newNotice.isDeleted = true;
        noticesRepository.findById.mockResolvedValue(newNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(
          noticeService.update(
            mockNoticeCreateInput,
            mockNotice.id,
            mockNotice.companyId,
          ),
        ).rejects.toThrowError(new ForbiddenException(ALREADY_DELETED_NOTICE));
      });
      it("소유하지 않은 공고를 수정하려는 경우", async () => {
        newNotice.companyId = mockId;
        noticesRepository.findById.mockResolvedValue(newNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(
          noticeService.update(
            mockNoticeCreateInput,
            mockNotice.id,
            mockNotice.companyId,
          ),
        ).rejects.toThrowError(new ForbiddenException(ALREADY_DELETED_NOTICE));
      });
    });
  });
  describe("NoticeService.setPublish", () => {
    const body = { isPublished: true };
    describe("[Success]", () => {
      it("채용 공고 공개 성공", async () => {
        noticesRepository.findById.mockResolvedValue(mockNotice);
        noticesRepository.setPublish.mockResolvedValue({
          ...mockNotice,
          ...body,
        });
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.setPublish(
          body,
          mockNotice.id,
          mockNotice.companyId,
        );

        expect(result.isPublished).toBe(true);
      });
      it("채용 공고 비공개 성공", async () => {
        const body = { isPublished: false };
        noticesRepository.findById.mockResolvedValue(mockNotice);
        noticesRepository.setPublish.mockResolvedValue({
          ...mockNotice,
          isPublished: false,
        });
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.setPublish(
          body,
          mockNotice.id,
          mockNotice.companyId,
        );

        expect(result.isPublished).toBe(false);
      });
    });
    describe("[Failure]", () => {
      it("공개하려는 공고가 없는 경우", async () => {
        noticesRepository.findById.mockResolvedValue(undefined);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );
        await expect(
          noticeService.setPublish(body, mockNotice.id, mockNotice.companyId),
        ).rejects.toThrowError(new NotFoundException(NOT_FOUND_NOTICE));
      });
      it("공개하려는 공고가 삭제된 경우", async () => {
        noticesRepository.findById.mockResolvedValue({
          ...mockNotice,
          isDeleted: true,
        });
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );
        await expect(
          noticeService.setPublish(body, mockNotice.id, mockNotice.companyId),
        ).rejects.toThrowError(new ForbiddenException(ALREADY_DELETED_NOTICE));
      });
      it("공개하려는 공고의 소유자가 아닌 경우", async () => {
        noticesRepository.findById.mockResolvedValue({
          ...mockNotice,
          companyId: mockId,
        });
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );
        await expect(
          noticeService.setPublish(body, mockNotice.id, mockNotice.companyId),
        ).rejects.toThrowError(new UnauthorizedException(NOT_NOTICE_OWNER));
      });
    });
  });
  describe("NoticeService.register", () => {
    const noticeIds = [cuid(), cuid(), cuid()];
    const body = { noticeIds };
    const userId = cuid();
    describe("[Success]", () => {
      it("채용 공고 등록 성공", async () => {
        const parseMockNotice = {
          ...mockNoticeWithApplicants,
          isDeleted: false,
          isPublished: true,
        };
        noticesRepository.findById.mockResolvedValue(parseMockNotice);
        userOnNoticesRepository.bulkCreate.mockResolvedValue([
          mockUserOnNotices,
        ]);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.register(body, userId);

        expect(result).toEqual([mockUserOnNotices]);
      });
    });
    describe("[Failure]", () => {
      it("삭제된 공고를 수강하려는 경우", async () => {
        const parseMockNotice = {
          ...mockNoticeWithApplicants,
          isDeleted: true,
          isPublished: true,
        };
        noticesRepository.findById.mockResolvedValue(parseMockNotice);
        userOnNoticesRepository.bulkCreate.mockResolvedValue([
          mockUserOnNotices,
        ]);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.register(body, userId)).rejects.toThrowError(
          new ForbiddenException(CANNOT_REGISTER_NOTICES),
        );
      });
      it("공개되지 않은 공고를 수강하려는 경우", async () => {
        const parseMockNotice = {
          ...mockNoticeWithApplicants,
          isDeleted: false,
          isPublished: false,
        };
        noticesRepository.findById.mockResolvedValue(parseMockNotice);
        userOnNoticesRepository.bulkCreate.mockResolvedValue([
          mockUserOnNotices,
        ]);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.register(body, userId)).rejects.toThrowError(
          new ForbiddenException(CANNOT_REGISTER_NOTICES),
        );
      });
      it("이미 수강한 공고를 수강하려는 경우", async () => {
        const parseMockNotice = {
          ...mockNoticeWithApplicants,
          isDeleted: false,
          isPublished: false,
          applicants: [{ id: userId }],
        };
        noticesRepository.findById.mockResolvedValue(parseMockNotice);
        userOnNoticesRepository.bulkCreate.mockResolvedValue([
          mockUserOnNotices,
        ]);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.register(body, userId)).rejects.toThrowError(
          new ConfilctException(EXISTS_ALREADY_TAKEN_NOTICE),
        );
      });
    });
  });
  describe("NoticeService.list", () => {
    const query: NoticeListQueryDto = {
      page: 1,
      take: 10,
      orderBy: "applicantsCount",
      category: "all",
      keyword: "유니티",
    };
    describe("[Success]", () => {
      it("list 불러오기 성공", async () => {
        noticesRepository.list.mockResolvedValue(mockNoticeRawSqlResult);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.list(query);
        expect(result).toEqual(mockNoticeListWithPage);
      });
    });
  });
  describe("NoticeService.detail", () => {
    describe("[Success]", () => {
      it("채용 공고 상세 불러오기 성공", async () => {
        noticesRepository.findById.mockResolvedValue(mockNotice);
        noticesRepository.detail.mockResolvedValue(mockNoticeRawSqlResult);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.detail(mockId);
        expect(result).toEqual(mockNoticeDetailResult);
      });
    });
    describe("[Failure]", () => {
      it("찾을 수 없는 공고인 경우", async () => {
        noticesRepository.findById.mockResolvedValue(undefined);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.detail(mockId)).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_NOTICE),
        );
      });
      it("삭제된 공고인 경우", async () => {
        const notice = { ...mockNotice, isDeleted: true };
        noticesRepository.findById.mockResolvedValue(notice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.detail(mockId)).rejects.toThrowError(
          new ForbiddenException(ALREADY_DELETED_NOTICE),
        );
      });
    });
  });
  describe("NoticeService.delete", () => {
    describe("[Success]", () => {
      it("채용 공고 삭제 성공", async () => {
        const notice = { ...mockNotice, applicants: [] };
        noticesRepository.findById.mockResolvedValue(notice);
        noticesRepository.delete.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        const result = await noticeService.delete(mockId);
        expect(result).toBe(mockNotice);
      });
    });
    describe("[Failure]", () => {
      it("찾을 수 없는 공고인 경우", async () => {
        noticesRepository.findById.mockResolvedValue(undefined);
        noticesRepository.delete.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.delete(mockId)).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_NOTICE),
        );
      });
      it("삭제하려는 공고에 수강생이 존재하는 경우", async () => {
        const notice = { ...mockNotice, applicants: [{}] };
        noticesRepository.findById.mockResolvedValue(notice);
        noticesRepository.delete.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.delete(mockId)).rejects.toThrowError(
          new ForbiddenException(ALREADY_EXISTS_APPLICANTS),
        );
      });
      it("이미 삭제된 공고인 경우", async () => {
        const notice = { ...mockNotice, applicants: [{}], isDeleted: true };
        noticesRepository.findById.mockResolvedValue(notice);
        noticesRepository.delete.mockResolvedValue(mockNotice);
        const noticeService = new NoticeService(
          noticesRepository,
          userOnNoticesRepository,
        );

        await expect(noticeService.delete(mockId)).rejects.toThrowError(
          new ConfilctException(ALREADY_DELETED_NOTICE),
        );
      });
    });
  });
});
