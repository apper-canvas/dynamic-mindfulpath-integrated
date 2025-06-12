import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Pill from '@/components/atoms/Pill';
import Card from '@/components/molecules/Card';

const AllergyEpisodeItem = ({ episode, index, onEdit, onDelete }) => {
  const formatDateTime = (datetimeString) => {
    return new Date(datetimeString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card delay={index * 0.1}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Text as="h3" className="text-lg font-semibold text-gray-800">
            {episode.trigger}
          </Text>
          <Text as="p" className="text-sm text-gray-500">
            {formatDateTime(episode.datetime)}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(episode)}
            variant="ghost"
            size="small"
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            onClick={() => onDelete(episode.id)}
            variant="ghost"
            size="small"
            className="p-2 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {episode.symptoms && episode.symptoms.length > 0 && (
          <div>
            <Text as="h4" className="text-sm font-medium text-gray-700 mb-2">Symptoms:</Text>
            <div className="flex flex-wrap gap-2">
              {episode.symptoms.map((symptom) => (
                <Pill key={symptom} color="warning" className="rounded">
                  {symptom}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {episode.remedies && episode.remedies.length > 0 && (
          <div>
            <Text as="h4" className="text-sm font-medium text-gray-700 mb-2">Remedies:</Text>
            <div className="flex flex-wrap gap-2">
              {episode.remedies.map((remedy) => (
                <Pill key={remedy} color="success" className="rounded">
                  {remedy}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const AllergyEpisodeList = ({ episodes, onEdit, onDelete, onLogEpisode }) => {
  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Shield" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-2">No allergy episodes logged</Text>
        <Text as="p" className="text-gray-600 mb-4">
          Start tracking your allergic reactions to identify patterns and triggers
        </Text>
        <Button
          onClick={onLogEpisode}
          variant="primary"
          size="large"
        >
          Log Your First Episode
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {episodes.map((episode, index) => (
        <AllergyEpisodeItem
          key={episode.id}
          episode={episode}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AllergyEpisodeList;