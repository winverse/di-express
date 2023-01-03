import {
  NoticeBulkCreateBodyDto,
  NoticeCreateBodyDto,
  NoticeRegisterBodyDto,
  NoticeUpdateBodyDto,
  NoticeListQueryDto,
  NoticeSetPublishBodyDto,
} from "@controllers/v1/notices/dto";
import { isCuid } from "cuid";
import {
  ConfilctException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from "src/common/exceptions";
import { Notice, NoticeListRawQueryResult } from "src/common/interface";
import {
  ALREADY_DELETED_NOTICE,
  ALREADY_EXISTS_APPLICANTS,
  CANNOT_REGISTER_NOTICES,
  DUPLICATED_NOTICES_TITLE,
  EXISTS_ALREADY_TAKEN_NOTICE,
  NOT_FOUND_NOTICE,
  NOT_NOTICE_OWNER,
} from "src/constants";

import { UserOnNotices, Notices, NoticeParseResult } from "src/entity";
import { NoticeRepository, UserOnNoticesRepository } from "src/repository";
import { injectable } from "tsyringe";

@injectable()
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly userOnNoticesRepository: UserOnNoticesRepository,
  ) {}
  // create notice
  async create(body: NoticeCreateBodyDto, companyId: string): Promise<Notice> {
    const notice = Notices.build({ ...body, companyId });

    const checkDuplicatedByTitle = await this.noticeRepository.findByTitle(
      body.title,
    );

    if (checkDuplicatedByTitle) {
      throw new ConfilctException(DUPLICATED_NOTICES_TITLE);
    }

    return await this.noticeRepository.create(notice);
  }
  // Bulk create notice
  async bulkCreate(
    body: NoticeBulkCreateBodyDto,
    companyId: string,
  ): Promise<Notice[]> {
    const bulkNoticesFindByTitle = body.notices
      .map((notice) => notice.title)
      .map((title) => this.noticeRepository.findByTitle(title));

    const checkDuplicatedByTitle = await Promise.all(bulkNoticesFindByTitle);

    const duplicatedTitles = checkDuplicatedByTitle.every((check) => check);

    if (duplicatedTitles) {
      throw new ConfilctException(DUPLICATED_NOTICES_TITLE);
    }

    const notices = body.notices
      .map((notice) => Object.assign(notice, { companyId }))
      .map(Notices.build);

    return await this.noticeRepository.bulkCreate(notices);
  }
  // update notice
  async update(body: NoticeUpdateBodyDto, noticeId: string, companyId: string) {
    const notice = await this.noticeRepository.findById(noticeId);

    if (!notice) {
      throw new NotFoundException(NOT_FOUND_NOTICE);
    }

    if (notice.isDeleted) {
      throw new ForbiddenException(ALREADY_DELETED_NOTICE);
    }

    if (notice.companyId !== companyId) {
      throw new UnauthorizedException(NOT_NOTICE_OWNER);
    }

    const input = {
      ...body,
      updatedAt: new Date(),
    };

    return await this.noticeRepository.update(input, noticeId);
  }
  // notice set publish
  async setPublish(
    body: NoticeSetPublishBodyDto,
    noticeId: string,
    companyId: string,
  ) {
    const notice = await this.noticeRepository.findById(noticeId);

    if (!notice) {
      throw new NotFoundException(NOT_FOUND_NOTICE);
    }

    if (notice.isDeleted) {
      throw new ForbiddenException(ALREADY_DELETED_NOTICE);
    }

    if (notice.companyId !== companyId) {
      throw new UnauthorizedException(NOT_NOTICE_OWNER);
    }

    return await this.noticeRepository.setPublish(body.isPublished, noticeId);
  }
  // notice register
  async register(body: NoticeRegisterBodyDto, userId: string) {
    const { noticeIds } = body;

    const notices = noticeIds.map((id) =>
      this.noticeRepository.findById(id, { join: true }),
    );

    const promises = await Promise.all(notices);

    const validatedNotices = promises
      .filter((notice) => !notice.isDeleted)
      .filter((notice) => notice.isPublished);

    if (noticeIds.length !== validatedNotices.length) {
      throw new ForbiddenException(CANNOT_REGISTER_NOTICES);
    }

    const isExistsAlreadyRegisterNotice = validatedNotices
      .flatMap((notice) => notice.applicants?.map((applicant) => applicant.id))
      .includes(userId);

    // retry
    if (isExistsAlreadyRegisterNotice) {
      throw new ConfilctException(EXISTS_ALREADY_TAKEN_NOTICE);
    }

    const registerInformation = body.noticeIds
      .map((id) => ({
        noticeId: id,
        userId,
      }))
      .map(UserOnNotices.build);

    return await this.userOnNoticesRepository.bulkCreate(registerInformation);
  }
  async list(query: NoticeListQueryDto) {
    const { page, take, category, orderBy, keyword } = query;

    const keywordIsCuid = keyword ? isCuid(keyword) : false;
    const ommitedQuery = { category };

    if (!keywordIsCuid) {
      Object.assign(ommitedQuery, { keyword });
    }

    const notices = await this.noticeRepository.list(ommitedQuery);
    const skip = (page - 1) * take;

    let result = this.setApplicantsInfo(notices);

    if (keyword && keywordIsCuid) {
      result = result.filter((notice) => notice.applicantIds.includes(keyword));
    }

    const totalCount = result.length;

    const rows = result
      .map((notice) => {
        const { applicantIds, applicants, updatedAt, ...rest } = notice;
        return rest;
      })
      .sort((a, b) => {
        if (orderBy === "createdAt") {
          const getTime = (date: string) => new Date(date).getTime();
          return getTime(b.createdAt) - getTime(a.createdAt);
        } else {
          return b.applicantCount - a.applicantCount;
        }
      })
      .slice(skip, skip + take);

    return {
      rows,
      totalCount,
    };
  }
  // load notice detail
  async detail(noticeId: string) {
    const notice = await this.noticeRepository.findById(noticeId);

    if (!notice) {
      throw new NotFoundException(NOT_FOUND_NOTICE);
    }

    if (notice.isDeleted) {
      throw new ForbiddenException(ALREADY_DELETED_NOTICE);
    }

    const detail = await this.noticeRepository.detail(noticeId);
    const { applicantIds, ...result } = this.setApplicantsInfo(detail)[0];

    return result;
  }
  // parse noticeList
  private setApplicantsInfo(
    target: NoticeListRawQueryResult[] | NoticeListRawQueryResult,
  ): NoticeParseResult[] {
    const list = Array.isArray(target) ? target : [target];
    return list.reduce((result, notice) => {
      const exists = result.find((r) => r.id === notice.id);
      const userId = notice.userId;

      const applicant = {
        username: notice.username,
        registeredAt: notice.registeredAt,
      };
      if (exists) {
        exists.applicantCount++;
        exists.applicantIds.push(notice.userId);
        exists.applicants.push(applicant);
      } else {
        const parseNotice: NoticeParseResult = {
          id: notice.id,
          title: notice.title,
          companyName: notice.companyName,
          category: notice.category,
          description: notice.description,
          createdAt: notice.createdAt,
          updatedAt: notice.updatedAt,
          applicantCount: notice.userEmail ? 1 : 0,
          applicantIds: [userId],
          applicants: [applicant],
        };
        result.push(parseNotice);
      }
      return result;
    }, [] as NoticeParseResult[]);
  }
  async delete(noticeId: string) {
    const notice = await this.noticeRepository.findById(noticeId, {
      join: true,
    });

    if (!notice) {
      throw new NotFoundException(NOT_FOUND_NOTICE);
    }

    if (notice.applicants!.length > 0) {
      throw new ForbiddenException(ALREADY_EXISTS_APPLICANTS);
    }

    if (notice.isDeleted) {
      throw new ConfilctException(ALREADY_DELETED_NOTICE);
    }

    return await this.noticeRepository.delete(noticeId);
  }
}
