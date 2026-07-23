import { seminarStatusToProgramStatus } from '../utils/seminarStatus';

describe('seminarStatusToProgramStatus', () => {
  it('모집 중(recruiting)은 PROCEEDING으로 매핑한다', () => {
    expect(seminarStatusToProgramStatus('recruiting')).toEqual(['PROCEEDING']);
  });

  it('모집 종료(closed)는 POST로 매핑한다', () => {
    expect(seminarStatusToProgramStatus('closed')).toEqual(['POST']);
  });
});
