import { getPageSections } from '../config-loader';
import { prisma } from '../prisma';

// Mock prisma
jest.mock('../prisma', () => ({
  prisma: {
    pageLayout: {
      findUnique: jest.fn(),
    },
  },
}));

describe('config-loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPageSections', () => {
    it('should return empty array when layout not found', async () => {
      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getPageSections('home');

      expect(result).toEqual([]);
    });

    it('should transform PageSection to SectionConfig format', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            enabled: true,
            order: 1,
            config: {
              headline: 'Test Headline',
              subheadline: 'Test Subheadline',
            },
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'section-1',
        type: 'hero',
        order: 1,
        visible: true,
        props: {
          headline: 'Test Headline',
          subheadline: 'Test Subheadline',
        },
      });
    });

    it('should filter out invisible sections', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            enabled: true,
            order: 1,
            config: { headline: 'Visible' },
          },
          {
            id: 'section-2',
            type: 'about',
            enabled: false,
            order: 2,
            config: { title: 'Hidden' },
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('section-1');
    });

    it('should sort sections by order', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-3',
            type: 'contact',
            enabled: true,
            order: 3,
            config: {},
          },
          {
            id: 'section-1',
            type: 'hero',
            enabled: true,
            order: 1,
            config: {},
          },
          {
            id: 'section-2',
            type: 'about',
            enabled: true,
            order: 2,
            config: {},
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('section-1');
      expect(result[1].id).toBe('section-2');
      expect(result[2].id).toBe('section-3');
    });

    it('should handle sections with visible property (old format)', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            visible: true,
            order: 1,
            props: {
              headline: 'Test',
            },
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(1);
      expect(result[0].visible).toBe(true);
      expect(result[0].props).toEqual({ headline: 'Test' });
    });

    it('should handle sections with both enabled and visible properties', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            enabled: false,
            visible: true,
            order: 1,
            config: {},
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      // enabled takes precedence over visible
      expect(result).toHaveLength(0); // filtered out because enabled is false
    });

    it('should default to visible=true when neither enabled nor visible is set', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            order: 1,
            config: {},
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(1);
      expect(result[0].visible).toBe(true);
    });

    it('should handle mixed section formats', async () => {
      const mockLayout = {
        pageName: 'home',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            enabled: true,
            order: 1,
            config: { headline: 'New Format' },
          },
          {
            id: 'section-2',
            type: 'about',
            visible: true,
            order: 2,
            props: { title: 'Old Format' },
          },
        ],
      };

      (prisma.pageLayout.findUnique as jest.Mock).mockResolvedValue(mockLayout);

      const result = await getPageSections('home');

      expect(result).toHaveLength(2);
      expect(result[0].props).toEqual({ headline: 'New Format' });
      expect(result[1].props).toEqual({ title: 'Old Format' });
    });
  });
});
