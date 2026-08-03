import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SEO } from '../src/components/SEO';

describe('SEO Component', () => {
  it('updates the document title and meta description correctly', () => {
    const testTitle = 'Test Title';
    const testDescription = 'Test Description';

    render(<SEO title={testTitle} description={testDescription} />);

    // Check if document title is updated
    expect(document.title).toBe(testTitle);
    
    // Check if meta description is updated
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).not.toBeNull();
    expect(metaDescription?.getAttribute('content')).toBe(testDescription);
  });
});
