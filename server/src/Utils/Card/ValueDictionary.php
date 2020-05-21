<?php


namespace App\Utils\Card;


class ValueDictionary
{
    public const TWO = '2';

    public const THREE = '3';

    public const FOUR = '4';

    public const FIVE = '5';

    public const SIX = '6';

    public const SEVEN = '7';

    public const EIGHT = '8';

    public const NINE = '9';

    public const TEN = 'T';

    public const JACK = 'J';

    public const QUEEN = 'Q';

    public const KING = 'K';

    public const ACE = 'A';

    public static function getValues()
    {
        return [
            self::TWO,
            self::THREE,
            self::FOUR,
            self::FIVE,
            self::SIX,
            self::SEVEN,
            self::EIGHT,
            self::NINE,
            self::TEN,
            self::JACK,
            self::QUEEN,
            self::KING,
            self::ACE
        ];
    }

    public static function getPolishRepresentation(string $value){
        switch ($value){
            case self::TEN: return "10";
            case self::JACK: return "Walet";
            case self::QUEEN: return "Dama";
            case self::KING: return "Król";
            case self::ACE: return "Ace";
            default: return $value;
        }
    }

}
